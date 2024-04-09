class BasePayload:
    @classmethod
    def get_fields(cls):
        return [attr for attr in dir(cls) if not callable(getattr(cls, attr)) and not attr.startswith("__")]

    def init(self, **kwargs):
        for key in kwargs:
            setattr(self, key, kwargs[key])
        return self

    def only(self, keys: list[str]) -> dict:
        """Returns specified fields as list"""
        data = {}
        for key in keys:
            try:
                data[key] = getattr(self, key)
            except KeyError:
                raise Exception(f'Key {key} is not present in payload')
        return data

    def all(self) -> dict:
        """Returns all fields as list"""
        data = {}
        for key in self.get_fields():
            try:
                data[key] = getattr(self, key)
            except KeyError:
                raise Exception(f'Key {key} is not present in payload')
        return data

    def but(self, keys: list[str]) -> dict:
        """Returns all fields except specified as list"""
        data = {}
        for key in self.get_fields():
            try:
                if key not in keys:
                    data[key] = getattr(self, key)
            except KeyError:
                raise Exception(f'Key {key} is not present in payload')
        return data
