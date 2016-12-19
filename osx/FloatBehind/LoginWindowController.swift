//
//  LoginWindowController.swift
//  FloatBehind
//
//  Created by katashin on 2016/01/31.
//  Copyright © 2016年 katashin. All rights reserved.
//

import Cocoa
import WebKit

protocol LoginWindowDelegate {
    func loginWindowDidSuccessLogin(_ window: NSWindow);
    func loginWindowDidCancelLogin(_ window: NSWindow);
}

class LoginWindowController: NSWindowController, WebFrameLoadDelegate {
    
    var delegate: LoginWindowDelegate?;
    
    @IBOutlet var webView: WebView!
    var windowCloseButton: NSButton!
    
    override func windowDidLoad() {
        super.windowDidLoad()
        
        self.webView.frameLoadDelegate = self;
        
        let request = URLRequest(url: URLConstants.slackLogin)
        self.webView.mainFrame.load(request)
        
        self.windowCloseButton = self.window?.standardWindowButton(.closeButton)
        self.windowCloseButton.target = self
        self.windowCloseButton.action = #selector(LoginWindowController.clickWindowCloseButton(_:))
    }
    
    func clickWindowCloseButton(_ sender: NSButton) {
        self.close()
        self.delegate?.loginWindowDidCancelLogin(self.window!)
    }
    
    // MARK: - WebFrameLoadDelegate
    func webView(_ sender: WebView!, didReceiveServerRedirectForProvisionalLoadFor frame: WebFrame!) {
        if frame.provisionalDataSource.request.url! == URLConstants.app as URL {
            frame.stopLoading()
            self.delegate?.loginWindowDidSuccessLogin(self.window!)
        }
    }
}
