package com.playwithexpobareminimumfresh.mylib

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
//        the below does not seem to make a difference in the layout (at least not for a simple component like this)
//        val textView =
//            LayoutInflater.from(reactContext).inflate(
//                R.layout.my_text_view, null
//            ) as TextView
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
