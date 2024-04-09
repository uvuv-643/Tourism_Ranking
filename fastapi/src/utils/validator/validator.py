from api.payloads.base import BasePayload
import re

from utils.validator.exceptions import AppValidationException


class Validator:

    def __init__(self, data: dict, rules: dict, titles: dict = None, dto: BasePayload = None, title_prefix: str = None):
        self.data = data
        self.rules = rules
        self.titles = titles if titles else {}
        self.dto = dto
        self.title_prefix = title_prefix

        self.is_validated = False

        self.errors = {}
        self.validated_data = {}

    def reset_is_validated(self):
        self.is_validated = False
        return self

    def validate(self):
        """Validates the data and throws exception if data is not valid"""
        self._validate()
        if self.errors:
            raise AppValidationException(errors=self.errors)

    def get_errors(self) -> dict:
        """Validates the data and returns dict with errors if data is not valid"""
        self._validate()
        return self.errors

    def validated(self, as_dict: bool = False):
        """Validates the data and throws exception if data is not valid else returns validated data"""
        self._validate()  # todo critical? refactored from validate() to _validate(). No more exceptions raised
        if self.dto is None or as_dict:
            return self.validated_data
        return self.dto.init(**self.validated_data)

    def only(self, keys: list[str]) -> dict:
        """Returns specified fields as dict"""
        print(self.validated(as_dict=True))
        return {key: value for key, value in self.validated(as_dict=True).items() if key in keys}

    def all(self) -> dict:
        """Returns all fields as dict"""
        return self.validated(as_dict=True)

    def not_null(self) -> dict:
        """Returns all fields as dict"""
        return {key: value for key, value in self.validated(as_dict=True).items() if value is not None}

    def but(self, keys: list[str]) -> dict:
        """Returns all fields except specified as dict"""
        return {key: value for key, value in self.validated(as_dict=True).items() if key not in keys}

    def but__not_null(self, keys: list[str]) -> dict:
        """Returns all fields except specified as dict"""
        return {key: value for key, value in self.validated(as_dict=True).items() if
                key not in keys and value is not None}

    def _validate(self):
        if self.is_validated:
            return

        rules_checker = Rules()
        """Split base and nested rules"""
        base_rules = {}
        nested_rules = {}
        for key in self.rules:
            if '.' not in key:
                base_rules[key] = self.rules[key]
            else:
                prefix, rest_key = key.split('.', 1)
                if prefix not in nested_rules:
                    nested_rules[prefix] = {}
                nested_rules[prefix][rest_key] = self.rules[key]

        for field in base_rules:
            try:
                rules = self.rules[field]
            except KeyError:
                continue

            if not isinstance(rules, list):
                raise Exception('Rules must be of type list')

            next_field_errors = []

            for rule in rules:
                try:
                    rule, args = self._parse_rule(rule)
                    check_function = getattr(rules_checker, rule)
                except AttributeError:
                    raise Exception(f'Rule {rule} is not defined')

                custom_title = None
                if field in self.titles:
                    custom_title = self.titles[field]
                elif self.title_prefix:
                    custom_title = self.title_prefix + field
                next_rule_error = check_function(self.data, field, custom_title, *args)

                if next_rule_error:
                    next_field_errors.append(next_rule_error)

            if len(next_field_errors) > 0:
                self.errors[field] = next_field_errors
            else:
                """Check if field not in nested rules to not add all nested objects to validated data at once"""
                if field in self.data and field not in nested_rules:
                    self.validated_data[field] = self.data[field]
        for field in nested_rules:
            """Check if field is array of objects, that required nested validation"""
            if isinstance(nested_rules[field], dict):
                try:
                    nested_data = self.data[field]
                except KeyError:
                    continue
                if not isinstance(nested_data, list):
                    continue
                """Create validator for nested objects"""
                nested_validator = Validator({}, nested_rules[field])
                """Traverse through nested objects and validate each one"""
                for key, nested_object in enumerate(nested_data):
                    title_prefix = (self.title_prefix + '_' if self.title_prefix else '') + field + '_' + str(key) + '_'
                    if not isinstance(nested_object, dict):
                        nested_object_errors = [title_prefix[:-1] + ' must be an object.']
                    else:
                        nested_validator.data = nested_object
                        """Set prefix to identify specific object errors"""
                        nested_validator.title_prefix = title_prefix
                        nested_validator.errors = {}
                        nested_validator.validated_data = {}

                        nested_validator.reset_is_validated()
                        nested_object_errors = nested_validator.get_errors()
                    if nested_object_errors:
                        if field not in self.errors:
                            self.errors[field] = []
                        self.errors[field].append(nested_object_errors)
                    else:
                        if field not in self.validated_data:
                            self.validated_data[field] = []
                        self.validated_data[field].append(nested_validator.validated())
                continue
        self.is_validated = True

    def _parse_rule(self, rule, separator=":", args_separator=","):
        args = []
        if separator in rule:
            rule, args = rule.split(separator)
            args = args.split(args_separator)
        return rule, args


class Rules:
    REQUIRED = 'required'
    NULLABLE = 'nullable'
    INTEGER = 'integer'
    FLOAT = 'float'
    STRING = 'string'
    LIST = 'list'
    REQUIRED_WITHOUT = 'required_without'

    @staticmethod
    def required(data: dict, key: str, title: str = None):
        if key in data and data[key] is not None:
            return None

        return f"{title if title else key} is required."

    @staticmethod
    def nullable(data: dict, key: str, title: str = None):
        if key in data:
            return None

        return f"{title if title else key} must be present."

    @staticmethod
    def integer(data: dict, key: str, title: str = None):
        if key in data and not isinstance(data[key], (int, type(None))):
            return f"{title if title else key} field must be of type integer."

        return None

    @staticmethod
    def bool(data: dict, key: str, title: str = None):
        if key in data and not isinstance(data[key], (bool, type(None))):
            return f"{title if title else key} field must be of type integer."

        return None

    @staticmethod
    def float(data: dict, key: str, title: str = None):
        if key in data and not (isinstance(data[key], (float, type(None))) or isinstance(data[key], (int, type(None)))):
            return f"{title if title else key} field must be of type float."

        return None

    @staticmethod
    def string(data: dict, key: str, title: str = None):
        if key in data and not isinstance(data[key], (str, type(None))):
            return f"{title if title else key} field must be of type string."

        return None

    @staticmethod
    def list(data: dict, key: str, title: str = None):
        if key in data and not isinstance(data[key], (list, type(None))):
            return f"{title if title else key} field must of type list."

        return None
    """
    @staticmethod
    def datetime(data: dict, key: str, title: str = None):
        if key in data and not isinstance(data[key], (datetime.datetime, type(None))):
            return f"{title if title else key} field must be of type datetime."

        return None
    """

    @staticmethod
    def required_without(data: dict, key: str, title: str = None, *fields: list):
        fields = [key, *fields]
        for field in fields:
            if field in data and data[field] is not None:
                return None

        return f"One of fields {', '.join(fields)} must be present."  # todo deal with title (pass titles 4 all fields somehow)

    @staticmethod
    def email(data: dict, key: str, title: str = None):
        if key in data and not re.fullmatch(
                re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'),
                str(data[key])
        ):
            return f"{title if title else key} field must a valid email."
        return None
