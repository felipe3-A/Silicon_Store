const appSigoSet = require("./config/server"); 

require("./config/database"); 
appSigoSet.listen(appSigoSet.get("port"), ()=> {
    console.log('Server in running on port:', appSigoSet.get('port'))
});