Feature: Edit Geotrigger
  In order to edit a new geotrigger
  As an administrator
  I want to be able click a geotrigger on a map
  Or click a geotrigger in the list
  And be able to modify its properties

  Background:
    Given an application named "Editor Test"

  Scenario: edit geotrigger form
    Given I am viewing the editor
    When I edit a geotrigger
    Then the geotrigger has been modified
