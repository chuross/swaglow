[![npm version](https://badge.fury.io/js/swaglow.svg)](https://badge.fury.io/js/swaglow)

# Swaglow

## Install
```
$ npm install --save swaglow
```

## Usage
### Initialize
without `-o`: default current dir path

```
$ swaglow init -o [output path]
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

### Build
without `-o`: default current dir path

```
$ swaglow build -o [output path]
```

## Example
### file tree example
```
root
- swaglow.json
- paths
  - users
    - (user_id)
      - index.yml
    - index.yml
- definitions
  - User.yml
- patameters
  - offset.yml
  - limit.yml
```

### swaglow.json example
```
{
	"title": "your project title",
	"baseUrl": "https://example.com/api/v1"
}
```

#### path example
##### paths/users/(user_id)/index.yml
```
get:
  tags: ['Users']
  operationId: getUserById
  parameters:
    - name: user_id
      in: path
      type: string
      required: true
  responses:
    200:
      description: ''
      schema:
        $ref: '#/definitions/User'
```

#### definition example
##### definitions/User.yml
```
type: object
properties:
  id:
    type: string
```

#### parameter example
##### parameters/offset.yml
```
name: limit
in: query
required: false
type: integer
default: 20
```

## generated yaml
```
swagger: '2.0'
info:
  title: your project title
  description: ''
  version: '1'
schemes:
  - https
host: example.com
basePath: /api/v1
produces:
  - application/json
parameters:
  limit:
    name: limit
    in: query
    required: false
    type: integer
    default: 20
  offset:
    name: offset
    in: query
    required: false
    type: integer
    default: 0

paths:
  /users/{user_id}:
    get:
      tags: ['Users']
      operationId: getUserById
      parameters:
        - name: user_id
          in: path
          type: string
          required: true
      responses:
        200:
          description: ''
          schema:
            $ref: '#/definitions/User'
  /users:
    get:
      tags: ['Users']
      operationId: getUsers
      parameters:
        - name: q
          in: query
          type: string
        - $ref: '#/parameters/offset'
        - $ref: '#/parameters/limit'
      responses:
        200:
          description: ''
          schema:
            type: array
            items:
              $ref: '#/definitions/User'

definitions:
  User:
    type: object
    properties:
      id:
        type: string

```

## License
MIT