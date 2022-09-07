#import "React/RCTViewManager.h"

@interface

RCT_EXTERN_MODULE(MyTextViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(textAlign, NSTextAlignment)
RCT_EXPORT_VIEW_PROPERTY(color, UIColor)

@end
