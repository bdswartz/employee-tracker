
INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Accounting'),
  ('Engineering'),
  ('Legal');
 
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, null),
  ('Virginia', 'Woolf', 2, null),
  ('Piers', 'Gaveston', 3, null),
  ('Charles', 'LeRoi', 5, null),
  ('Katherine', 'Mansfield', 4, 3),
  ('Dora', 'Carrington', 6, 4),
  ('Edward', 'Bellamy', 7, 1),
  ('Montague', 'Summers', 8, 2),
  ('Octavia', 'Butler', 4, 3),
  ('Unica', 'Zurn', 6, 4),
  ('Mickey', 'Mantle', 7, 1),
  ('Bart', 'Starr', 8, 2),
  ('Eric', 'Cartmann', 4, 3),
  ('Bill', 'Preston', 6, 4),
  ('Ted', 'Logan', 7, 1),
  ('Daniel', 'LaRusso', 8, 2);

INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Manager', 150000, 1),
  ('Lead Engineer', 120000, 3),
  ('Account Manager', 80000, 2),
  ('Accountant', 50000, 2),
  ('Chief Counsel', 180000, 4),
  ('Lawyer', 125000, 4),
  ('Sales Person', 100000, 1),
  ('Engineer', 80000, 3);