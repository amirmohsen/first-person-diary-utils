#!/usr/bin/env python

import sys
import turtle
import json
import os
import pprint

# definitions

def safe_input(input_message):
    if not sys.stdin:
        sc = turtle.Screen(); #access turtle screen
        sc.setup(0, 0); # change the screen size to zero
        return turtle.textinput("First Person Diary - Export", input_message); #prompt the user with an input dialog
    return input(str)

def get_current_project():
  project_manager = resolve.GetProjectManager()
  project = project_manager.GetCurrentProject()
  return project

def render_all_timelines(project_dir_path, project):
  resolve.OpenPage('deliver')
  timelineIndex = 1
  while timelineIndex <= project.GetTimelineCount():
    timeline = project.GetTimelineByIndex(timelineIndex)
    project.SetCurrentTimeline(timeline)
    project.SetRenderSettings({
      'TargetDir': project_dir_path,
      'CustomName': project.GetName() + '-' + timeline.GetName(),
      'ExportVideo': True,
      'ExportAudio': True,
      'FormatWidth': 3840,
      'FormatHeight': 2160,
      'FrameRate': 29.97,
      'VideoQuality': 90000
    })
    project.AddRenderJob()
    timelineIndex += 1
  project.StartRendering(True)


# run

project_dir_path = safe_input('Project dir path? ')

project = get_current_project()

render_all_timelines(project_dir_path, project)
