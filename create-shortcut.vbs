Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\Start StudyConnect.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "c:\Users\zalav\OneDrive\Desktop\StudyConnect\START-STUDYCONNECT.bat"
oLink.WorkingDirectory = "c:\Users\zalav\OneDrive\Desktop\StudyConnect"
oLink.Description = "Start StudyConnect Application (Frontend + Backend)"
oLink.IconLocation = "C:\Windows\System32\shell32.dll,137"
oLink.Save
WScript.Echo "Desktop shortcut created successfully!"
