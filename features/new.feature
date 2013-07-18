Feature: New Geotrigger
  In order to create a new geotrigger
  As an administrator
  I want to be able to fill out a form or draw on a map

  Background:
    Given I am viewing the editor
    Given an application named "Editor Test"

  Scenario: new geotrigger form
    When I click the new trigger button in the sidebar
    And I see the new geotrigger form
    And I fill it out
    Then I see my new geotrigger in the list

  Scenario: polygon tool
    When I click the polygon tool
    And I draw a polygon on the map
    Then I see the new geotrigger form with the polygon's location

  Scenario: radius tool
    When I click the radius tool
    And I draw a circle on the map
    Then I see the new geotrigger form with the circle's location

  Scenario: drivetime tool
    When I click the drivetime tool
    And I draw a point on the map
    Then I see the new geotrigger form with the drivetime's location
