package com.rncliprojectsandbox

import android.view.Gravity
import android.widget.TextView
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.uimanager.BaseViewManager
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewProps
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.text.ReactTextShadowNode

const val REACT_CLASS = "MyTextView"

class MyTextViewManager : BaseViewManager<TextView, LayoutShadowNode>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext): TextView {
        return TextView(reactContext)
    }

    @ReactProp(name = ViewProps.COLOR)
    fun setColor(view: TextView, color: Int) {
        view.setTextColor(color)
    }

    @ReactProp(name = ViewProps.TEXT_ALIGN)
    fun setTextAlign(view: TextView, textAlign: String) {
        val gravity = when (textAlign) {
            "auto" -> Gravity.NO_GRAVITY
            "left" -> Gravity.START
            "right" -> Gravity.END
            "center" -> Gravity.CENTER_HORIZONTAL
            else -> throw JSApplicationIllegalArgumentException("Invalid textAlign: $textAlign")
        }

        view.gravity = gravity
    }

    @ReactProp(name = "title")
    fun setTitle(view: TextView, title: String) {
        view.text = title
    }

    override fun createShadowNodeInstance(): LayoutShadowNode {
        return ReactTextShadowNode()
    }

    override fun getShadowNodeClass(): Class<out LayoutShadowNode> {
        return ReactTextShadowNode::class.java
    }

    override fun updateExtraData(root: TextView, extraData: Any?) {
    }
}
