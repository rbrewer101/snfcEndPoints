
### Foxx Application to Expose Food Service HTTP Enpoints

#### This Foxx app expects the following collections:
 - snfcEndPoints_recipes (type: document, see model for schema)
 - snfcEndPoints_ingredients (type: document, see model for schema)
 - snfcEndPoints_edges (edge collection connecting recipes and ingredients, see model for schema)

#### Dependencies
Install the applications listed in manifest.json in order to meet user and session dependencies.

#### Installation (on same machine that meets above prerequisites)

 1. Open up permissions on dev path, then edit the app-path in /etc/arangodb/arangod.conf. For example:
```
[javascript]
app-path = /home/webdev/src/
```
 2. Restart arango
 3. Install dependencies listed in manifest.json (use mount points from manifest.json)
 4. Install application
$ foxx-manager install <directory containing app code> /snfcEndPoints
e.g.
```
foxx-manager install /home/webdev/src/snfcEndPoints/APP /snfcEndPoints --server.endpoint tcp://10.10.10.205:8529 --server.database snfc
```
 5. In gui - dependencies (blocks icon in service), enter dependencies manually in the form
```
util_simple_auth  
util_sessions_local
util_users_local
```