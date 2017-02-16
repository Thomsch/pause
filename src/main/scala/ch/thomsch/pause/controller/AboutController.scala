package ch.thomsch.pause.controller

import java.awt.Desktop
import java.net.URL
import javafx.fxml.FXML

import ch.thomsch.pause.About

import scalafx.scene.control.Hyperlink
import scalafx.scene.input.{KeyCode, KeyEvent}
import scalafxml.core.macros.sfxml

/**
  * @author Thomsch
  */
@sfxml
class AboutController(@FXML private val gitHubLink: Hyperlink) {

  @FXML
  def onEnterPressed(event : KeyEvent) : Unit = {
    if(event.code == KeyCode.Enter) {
    } else if(event.code == KeyCode.Escape) About.hide()
  }


  @FXML
  def onGitHubLinkClick(event: scalafx.event.ActionEvent): Unit = {
    val desktop : Desktop = Desktop.getDesktop
    if(desktop != null) {
      desktop.browse(new URL(gitHubLink.getText).toURI)
    }
  }
}
