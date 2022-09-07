import UIKit
import React

@objc(MyTextViewManager)
class MyTextViewManager: RCTViewManager {

  override func view() -> UIView! {
    MyLabel()
  }

  override func shadowView() -> RCTShadowView! {
    let shadowView = RCTTextShadowView.init(bridge: self.bridge)
    return shadowView
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

class MyLabel: UILabel {
  @objc
  func setTitle(_ value: String) {
    text = value
  }

  @objc
  func setTextAlign(_ value: NSTextAlignment) {
    textAlignment = value
  }

  @objc
  func setColor(_ value: UIColor) {
    textColor = value
  }
}
