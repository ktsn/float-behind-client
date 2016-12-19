//
//  AppCookieService.swift
//  FloatBehind
//
//  Created by katashin on 2016/03/15.
//  Copyright © 2016年 katashin. All rights reserved.
//

import Cocoa

class AppCookieSet: Sequence {
    fileprivate let storage = HTTPCookieStorage.shared
    
    func cookieForName(_ name: String) -> HTTPCookie? {
        return self.filter({ c in c.name == name }).first
    }
    
    func removeCookieForName(_ name: String) {
        for cookie: HTTPCookie in self {
            if cookie.name == name {
                storage.deleteCookie(cookie)
            }
        }
    }
    
    func makeIterator() -> AnyIterator<HTTPCookie> {
        let cookies: [HTTPCookie] = self.storage.cookies(for: URLConstants.app as URL) ?? []
        
        var index = 0
        return AnyIterator<HTTPCookie> {
            if index < cookies.count {
                let result = cookies[index]
                index += 1
                return result
            }
            
            return nil
        }
    }
}

// Cookie service for FloatBehind app server
class AppCookieService: NSObject {
    static let sharedService = AppCookieService()
    
    fileprivate let cookieSet = AppCookieSet()
    
    override fileprivate init() {}
    
    func valueForName(_ name: String) -> String? {
        return self.cookieSet.cookieForName(name)?.value
    }
    
    func removeCookieForName(_ name: String) {
        self.cookieSet.removeCookieForName(name)
    }
}
