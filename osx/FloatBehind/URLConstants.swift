//
//  Constants.swift
//  FloatBehind
//
//  Created by katashin on 2016/01/31.
//  Copyright © 2016年 katashin. All rights reserved.
//

#if LOCAL
    let host = "http://localhost.floatbehind.ninja:3000/"
#else
    let host = "https://app.floatbehind.ninja/"
#endif

import Cocoa

struct URLConstants {
    static let app = URL(string: host)!
    static let slackLogin = URL(string: "/oauth/slack", relativeTo: URLConstants.app)!.absoluteURL
    static let me = URL(string: "/api/v1/users/me", relativeTo: URLConstants.app)!.absoluteURL
}
