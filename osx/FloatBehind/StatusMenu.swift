//
//  StatusMenu.swift
//  FloatBehind
//
//  Created by katashin on 2016/03/14.
//  Copyright © 2016年 katashin. All rights reserved.
//

import Cocoa

class StatusMenu: NSMenu, LoginServiceDelegate {
    
    @IBOutlet weak var loginToggleItem: NSMenuItem!
    
    var loginWindowController: NSWindowController?
    
    var loggedIn: Bool = false {
        didSet {
            self.loginToggleItem.title = loggedIn ? "Logout" : "Login"
        }
    }
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        
        LoginService.sharedService.addDelegate(self)
    }
    
    deinit {
        LoginService.sharedService.removeDelegate(self)
    }
    
    func clickLoginItem(_ sender: NSMenuItem) {
        if (self.loggedIn) {
            self.logout()
        } else {
            self.showLoginWindow()
        }
    }
    
    func showLoginWindow() {
        self.loginWindowController = LoginService.sharedService.loginWindowController
        self.loginWindowController?.showWindow(nil)
    }
    
    func logout() {
        LoginService.sharedService.logout()
    }
    
    // MARK: - LoginServiceDelegate
    func loginService(_ loginService: LoginService, didChangeLoggedIn loggedIn: Bool) {
        self.loggedIn = loggedIn
        self.loginWindowController?.close()
        self.loginWindowController = nil
    }
}
