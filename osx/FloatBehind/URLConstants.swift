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
    static let root = URL(string: host)!
    static let app = Bundle.main.url(forResource: "www/index", withExtension: "html")!
    static let slackLogin = URL(string: "/oauth/slack", relativeTo: URLConstants.root)!.absoluteURL
    static let me = URL(string: "/api/v1/users/me", relativeTo: URLConstants.root)!.absoluteURL
}
