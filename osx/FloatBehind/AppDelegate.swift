//
//  AppDelegate.swift
//  FloatBehind
//
//  Created by katashin on 2015/11/15.
//  Copyright © 2015年 katashin. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    
    @IBOutlet weak var statusMenu: StatusMenu!
    
    var statusItem: NSStatusItem!
    var windowController: BehindWindowController = BehindWindowController(windowNibName: "BehindWindowController")
    
    func applicationDidFinishLaunching(_ aNotification: Notification) {
        let ud = UserDefaults.standard
        ud.set(true, forKey: "WebKitDeveloperExtras")
        ud.synchronize()
        self.windowController.showWindow(nil)
        
        self.setupStatusItem()
        
        LoginService.sharedService.fetchAccount()
    }
    
    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }
    
    func setupStatusItem() {
        let systemStatusBar = NSStatusBar.system()
        self.statusItem = systemStatusBar.statusItem(withLength: NSVariableStatusItemLength)
        self.statusItem.highlightMode = true
        self.statusItem.image = NSImage(named: "StatusBarIconTemplate")
        self.statusItem.menu = self.statusMenu
    }
    
    @IBAction func clickLoginItem(_ sender: NSMenuItem) {
        self.statusMenu.clickLoginItem(sender)
    }
    
    @IBAction func clickOverIcons(_ sender: NSMenuItem) {
        self.windowController.window?.level = Int(CGWindowLevelForKey(CGWindowLevelKey.desktopIconWindow)) + 1
    }
    
    @IBAction func clickBehindIcons(_ sender: NSMenuItem) {
        self.windowController.window?.level = Int(CGWindowLevelForKey(CGWindowLevelKey.desktopIconWindow)) - 1
    }
    
    @IBAction func clickQuitItem(_ sender: NSMenuItem) {
        NSApplication.shared().terminate(self)
    }
}

