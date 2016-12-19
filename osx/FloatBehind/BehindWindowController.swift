//
//  BehindWindowController.swift
//  FloatBehind
//
//  Created by katashin on 2015/11/15.
//  Copyright © 2015年 katashin. All rights reserved.
//

import Cocoa
import WebKit

class BehindWindowController: NSWindowController, NSWindowDelegate, WebFrameLoadDelegate, LoginServiceDelegate {
    
    @IBOutlet var webView: WebView!;
    
    deinit {
        LoginService.sharedService.removeDelegate(self)
    }
    
    override func windowDidLoad() {
        super.windowDidLoad()
        
        guard let window = self.window else {
            return;
        }
        
        window.delegate = self
        
        fitWindowToScreen(window)
        
        // set the window behind all other windows
        window.level = Int(CGWindowLevelForKey(CGWindowLevelKey.desktopIconWindow)) + 1
        
        // should be transparent
        window.backgroundColor = NSColor.clear
        window.isOpaque = false
        
        // WebView settings
        self.webView.frameLoadDelegate = self;
        self.webView.drawsBackground = false;
        let request = URLRequest(url: URLConstants.app as URL)
        self.webView.mainFrame.load(request)
        
        // Observe login state
        LoginService.sharedService.addDelegate(self)
    }
    
    func requestPreviewCard(_ urlString: String) {
        if let url = URL(string: urlString) {
            NSWorkspace.shared().open(url)
        }
    }
    
    override class func isSelectorExcluded(fromWebScript aSelector: Selector) -> Bool {
        switch aSelector {
        case #selector(BehindWindowController.requestPreviewCard(_:)):
            return false
        default:
            return true
        }
    }
    
    fileprivate func fitWindowToScreen(_ window: NSWindow) {
        guard let rect = NSScreen.main()?.visibleFrame else {
            return;
        }
        
        // fill the window to screen size
        self.window?.setFrame(rect, display: true)
    }
    
    // MARK: - NSWindowDelegate
    func windowDidChangeScreen(_ notification: Notification) {
        if let window = self.window {
            fitWindowToScreen(window)
        }
    }
    
    // MARK: - WebFrameLoadDelegate
    func webView(_ sender: WebView!, didFinishLoadFor frame: WebFrame!) {
        if let _ = frame.findNamed("_top") {
            sender.windowScriptObject.setValue(self, forKey: "Native")
        }
    }
    
    func webView(_ sender: WebView!, didStartProvisionalLoadFor frame: WebFrame!) {
        // prevent the main webview to load unexpected pages
        if frame.provisionalDataSource.request.url != URLConstants.app as URL {
            frame.stopLoading()
        }
    }
    
    // MARK: LoginServiceDelegate
    func loginService(_ loginService: LoginService, didChangeLoggedIn loggedIn: Bool) {
        self.webView.reload(nil)
    }
}
