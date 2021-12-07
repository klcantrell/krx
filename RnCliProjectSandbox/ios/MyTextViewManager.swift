import UIKit
import React

@objc(MyTextViewManager)
class MyTextViewManager: RCTViewManager {
  var label = UILabel()

  @objc var text: String = "" {
    didSet {
      print("label set!")
      label.text = text
    }
  }
  
  override func view() -> UIView! {
    let label = UILabel()
    label.textColor = .red
    label.textAlignment = .center
    return label
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
