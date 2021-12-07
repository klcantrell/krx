package com.rncliprojectsandbox

import android.graphics.Color
import android.view.Gravity
import android.widget.TextView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

const val REACT_CLASS = "MyTextView"

class MyTextViewManager : SimpleViewManager<TextView>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext): TextView {
        val textView = TextView(reactContext)
        textView.setTextColor(Color.RED)
        textView.gravity = Gravity.CENTER
        return textView
    }

    @ReactProp(name = "text")
    fun setText(view: TextView, text: String) {
        view.text = text
    }
}
