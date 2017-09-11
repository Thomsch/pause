package ch.thomsch.pause.ui.settings

import javafx.beans.value.{ChangeListener, ObservableValue}
import javafx.css.PseudoClass

import scalafx.scene.control.{TextField, ToggleButton}

/**
  * Verifies the user inputs and highlight them if they are not correct.
  * If any user input is not correct, it will disable the main button.
  *
  * @author Thomsch
  */
class InputValidator(private val workDuration: TextField,
                     private val onOffButton: ToggleButton) extends ChangeListener[String] {
  val STYLE_ERROR: PseudoClass = PseudoClass.getPseudoClass("error")

  workDuration.text.addListener(this)

  override def changed(observable: ObservableValue[_ <: String], oldValue: String, newValue: String): Unit = {
    val workDurationIsInvalid = !isWorkDurationValid
    workDuration.pseudoClassStateChanged(STYLE_ERROR, workDurationIsInvalid)
    onOffButton.setDisable(workDurationIsInvalid)
  }

  /**
    * Returns whether the work duration is valide.
    * A work duration is valid if it's a integer number greater than zero.
    */
  def isWorkDurationValid: Boolean = {
    try {
      workDuration.getText.toLong > 0
    } catch {
      case _: NumberFormatException => false
    }
  }
}
