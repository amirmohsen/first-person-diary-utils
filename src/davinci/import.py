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
        return turtle.textinput("First Person Diary - Import", input_message); #prompt the user with an input dialog
    return input(str)

def create_project(project_dir_path):
    project_name = os.path.basename(project_dir_path)
    project_manager = resolve.GetProjectManager()
    project = project_manager.CreateProject(project_name)
    project_settings = {
        'timelineResolutionWidth': '3840',
        'timelineResolutionHeight': '2160',
        'timelineFrameRate': '29.97',
        'videoMonitorFormat': 'UHD 2160p 29.97',
        'timelinePlaybackFrameRate': '29.97'
    }

    for item in project_settings.items():
        project.SetSetting(item[0], item[1])

    resolve.OpenPage('edit')

    return project

def read_meta_data(project_dir_path):
    meta_data_file_path = os.path.join(project_dir_path, 'meta.json')
    with open(meta_data_file_path) as file:
        data = json.load(file)
        return data

def import_all_media(project_dir_path, media_pool):
    media_dir_path = os.path.join(project_dir_path, 'media')
    media_pool_items_list = media_pool.ImportMedia(media_dir_path)
    media_pool_items = {}

    for media_pool_item in media_pool_items_list:
        media_pool_item_name = media_pool_item.GetName()
        proxy_media_path = os.path.join(project_dir_path, 'proxy', media_pool_item_name)
        media_pool_item.LinkProxyMedia(proxy_media_path)
        media_pool_items[media_pool_item_name] = media_pool_item

    return media_pool_items

def add_media_pool_items_by_meta_data(media_pool_items, media_pool, metadata):
    timelines = []
    for timelineId, file_names in metadata['timelines'].items():
        clips = []
        for file_name in file_names:
            clips.append(media_pool_items[file_name])
        timeline = media_pool.CreateTimelineFromClips(timelineId, clips)
        timelines.append(timeline)
    return timelines


# run

project_dir_path = safe_input('Project dir path? ')

metadata = read_meta_data(project_dir_path)

project = create_project(project_dir_path)

media_pool = project.GetMediaPool()

media_pool_items = import_all_media(project_dir_path, media_pool)

add_media_pool_items_by_meta_data(media_pool_items, media_pool, metadata)
