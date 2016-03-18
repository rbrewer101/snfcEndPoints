
### Foxx SNFC Enpoints

#### This Foxx app expects the following collections:
 - snfcEndPoints_recipes (type: document, see model for schema)
 - snfcEndPoints_ingredients (type: document, see model for schema)
 - snfcEndPoints_edges (edge collection connecting recipes and ingredients, see model for schema)

#### Dependencies
Install the applications listed in manifest.json in order to meet user and session dependencies.

#### Installation (on same machine that meets above prerequisites)

 - Open up permissions on dev path, then edit the app-path in /etc/arangodb/arangod.conf. For example:
```
[javascript]
app-path = /home/webdev/src/
```
 - Restart arango
 - Install dependencies listed in manifest.json (use mount points from manifest.json):
 ```
/util_simple_auth
/util_sessions_local
/util_users_local
 ```
 - Install application. For example:
```
foxx-manager install /home/webdev/src/ /snfcEndPoints --server.endpoint tcp://10.12.4.205:8529 --server.database snfc
```
 - In gui - dependencies (blocks icon in service), enter dependencies manually in the form
```
util_simple_auth  
util_sessions_local
util_users_local
```