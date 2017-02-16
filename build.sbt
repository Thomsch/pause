// Name of the project
name := "Pause"

// Project version
version := "0.7"

// Version of Scala used by the project
scalaVersion := "2.11.8"

// Add dependency on ScalaFX library
libraryDependencies ++= Seq(
  "org.scalafx" %% "scalafx" % "8.0.102-R11",
  "org.scalafx" %% "scalafxml-core-sfx8" % "0.2.2"
)

scalacOptions ++= Seq("-unchecked", "-deprecation", "-Xcheckinit", "-encoding", "utf8", "-feature")

addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

// Fork a new JVM for 'run' and 'test:run', to avoid JavaFX double initialization problems
fork := true

assemblyJarName in assembly := "pause-v0.7.jar"
