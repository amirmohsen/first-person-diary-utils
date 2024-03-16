#!/usr/bin/env python

import sys
import turtle

def safe_input(input_message):
    if not sys.stdin:
        sc = turtle.Screen(); #access turtle screen
        sc.setup(0, 0); # change the screen size to zero
        return turtle.textinput("Your App Title", input_message); #prompt the user with an input dialog
    return input(str)

projectManager = resolve.GetProjectManager()

# pname = safe_input('Project name? ')

# project = projectManager.CreateProject(pname)
project = projectManager.CreateProject('test')

projectSettings = {
    'timelineResolutionWidth': '3840',
    'timelineResolutionHeight': '2160',
    'timelineFrameRate': '29.97',
    'videoMonitorFormat': 'UHD 2160p 29.97',
    'timelinePlaybackFrameRate': '29.97'
}

for item in projectSettings.items():
    project.SetSetting(item[0], item[1])

resolve.OpenPage('edit')

mediaPool = project.GetMediaPool()

mediaFolderPath = safe_input('Import folder path? ')

mediaPoolItems = mediaPool.ImportMedia(mediaFolderPath)

# tname = safe_input('Timeline setting? ')
timelineSettings = 'driving=18+19&hike=20-25'

timelineSettingsGroups = timelineSettings.split('&')

# mediaPool.CreateEmptyTimeline(tname)
