Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\Start StudyConnect.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "C:\Users\zalav\OneDrive\Desktop\TY Project 1\TY Project 1\TY Project 1\START-STUDYCONNECT.bat"
oLink.WorkingDirectory = "C:\Users\zalav\OneDrive\Desktop\TY Project 1\TY Project 1\TY Project 1"
oLink.Description = "Start StudyConnect Application (Frontend + Backend)"
oLink.IconLocation = "C:\Windows\System32\shell32.dll,137"
oLink.Save
WScript.Echo "Desktop shortcut created successfully!"
