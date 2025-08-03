#!/bin/bash
mongosh <<EOF
use admin;

db.auth("root", "root");

var cfg = {
    "_id": "nexlehr",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "mongo:27017",
            "priority": 1
        }
    ],
    "settings": {
        "chainingAllowed": true
    }
};

rs.initiate(cfg, { force: true });
rs.reconfig(cfg, { force: true });

EOF
