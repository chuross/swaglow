[![npm version](https://badge.fury.io/js/swaglow.svg)](https://badge.fury.io/js/swaglow)

# Swaglow

## Install
```
$ npm install --save swaglow
```

## Usage
### Initialize
```
$ swaglow init
```
### Develop
`swaglow init` will create derectories.

```
root
- swaglow.json // config file for building.
- paths // endpoint files.
- definitions // definition file
- parameters // common parameter file
```

### path
#### example
`.yml` file name is no limited.

```
root
- paths
  - items
    - (item_id)
      - comments
        - endpoint.yml
      - endpoint.yml
    - endpoint.yml
  - users
    - endpoint.yml
```

#### generated yaml
```
...
paths:
  - /items
    ...
    ...
  - /items/{item_id}
    ...
    ...
  - /items/{item_id}/comments
    ...
    ...
  - /users
    ...
    ...
```

### Definition
#### example
```
root
- definitions
  - Item.yml
  - User.yml
```

#### generated yaml
```
...
definitions:
  Item:
    type: object
    ...
  User:
    type: object
    ...
```

### Build
```
$ swaglow build -o [output path]
```

## License
MIT