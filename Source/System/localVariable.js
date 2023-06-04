const fs = require('fs');

const dataPath = require('path').join(__dirname, "../../Data/variable.json")
let variable = null;

function load(){
    if(!fs.existsSync(dataPath)){
        variable = { };
        save();
        return;
    }
    
    const file = fs.readFileSync(dataPath);
    variable = JSON.parse(file);
}

function save(){
    fs.writeFileSync(dataPath, JSON.stringify(variable));
}

function getNode(node, path, createNode=false){
    if(createNode && !(path in node)){
        node[path] = { };
    }

    return node[path];
}

function get(path){
    if(variable == null) load();

    const paths = path.split('/')
    let node = getNode(variable, paths[0]);
    for (var i = 1; i < paths.length; i++) {        
        node = getNode(node, paths[i]);
    }

    return node
}

function set(path, value){
    if(variable == null) load();

    const paths = path.split('/')
    let node = getNode(variable, paths[0], true);
    for (var i = 1; i < paths.length; i++) {
        if(i == paths.length - 1) {
            node[paths[i]] = value;
            break;
        }

        node = getNode(node, paths[i], true);
    }
    save();
}

module.exports = { get, set }