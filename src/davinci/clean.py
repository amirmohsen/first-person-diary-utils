#!/usr/bin/env python

projectManager = resolve.GetProjectManager()

project = projectManager.GetCurrentProject()

projectManager.CloseProject(project)

projectManager.DeleteProject('test')
