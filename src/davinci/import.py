#!/usr/bin/env python

import sys
import turtle

def safe_input(input_message):
    if not sys.stdin:
        sc = turtle.Screen(); #access turtle screen
        sc.setup(0, 0); # change the screen size to zero
        return turtle.textinput("Your App Title", input_message); #prompt the user with an input dialog
    return input(str);

projectManager = resolve.GetProjectManager()

pname = safe_input('Project name? ')

project = projectManager.CreateProject(pname)
