//
//  Account.swift
//  FloatBehind
//
//  Created by katashin on 2016/03/20.
//  Copyright © 2016年 katashin. All rights reserved.
//

import Cocoa
import JSONJoy

struct Account: JSONJoy {
    var sessionID: String! = nil
    let name: String
    let email: String
    let iconURL: String
    
    init(sessionID: String, decoder: JSONDecoder) throws {
        try self.init(decoder)
        self.sessionID = sessionID;
    }
    
    init(_ decoder: JSONDecoder) throws {
        self.name = try decoder["name"].getString()
        self.email = try decoder["email"].getString()
        self.iconURL = try decoder["iconUrl"].getString()
    }
}
