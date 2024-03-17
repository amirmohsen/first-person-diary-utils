#!/usr/bin/env python

projectManager = resolve.GetProjectManager()

project = projectManager.GetCurrentProject()

projectName = project.GetName()

projectManager.CloseProject(project)

projectManager.DeleteProject(projectName)
