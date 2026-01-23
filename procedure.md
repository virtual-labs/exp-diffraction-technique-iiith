### Procedure
This experiment focuses on constructing a unit cell of a lattice. You will work with four different lattices: **Simple Cubic (SC)**, **Face-Centered Cubic (FCC)**, **Body-Centered Cubic (BCC)**, and **Hexagonal Close-Packed (HCP)**. The goal is to build the correct unit cell by selecting the appropriate atoms and verifying the construction. 

### Steps for the Experiment
- Interface Overview:
  - The interface provides a dropdown menu to switch between the four lattice types.
  - A toggle switch allows you to enter "Select Atoms" mode for choosing atoms within the unit cell.
  - The select region feature enables the selection of atoms within a specified 3D region.
  - There are also buttons for clearing selections and checking the correctness of your constructed unit cell.
- Building the Unit Cell: First, you can add atoms to the unit cell using features like
  - Add Atom at Coordinates: This allows you to place an atom at specific coordinates within the lattice.
  - Repeat Selected Pattern: You can select a pattern of atoms and repeat it once along a given vector direction.
  - Translate Pattern: This feature allows repeating the selected pattern multiple times in the specified direction (N times).
  - Move Selected Pattern: Shift a group of selected atoms in a specific direction to refine the unit cell construction.
- Using Dummy Atoms for Verification:
  - Use the Add Dummy Atom at Coordinate feature to insert a temporary atom at a specific location. This helps you visually check the validity of your unit cell before finalizing it.
  - Note that dummy atoms are not considered when you use the Check Packing button to verify the correctness of your unit cell.
- Checking the Unit Cell:
  - Once you’ve constructed the unit cell, select the atoms that make up the unit cell, choose the corresponding lattice type from the dropdown, and then click the Check Packing button.
  - This will evaluate the construction and display whether the unit cell is correct.
- Selecting Atoms in Complex Lattices:
  - Some lattices, particularly those with atoms located in difficult-to-select positions (e.g., inner atoms in FCC or BCC lattices), may require you to use the Select Region feature.
  - Select Region allows you to select all atoms inside a defined 3D region enclosed by selected atoms. It also selects atoms whose centers are located on the surface of the polyhedron formed by these selected atoms.
- Handling Irrational Coordinates:
  - In some cases, you may observe that the atom coordinates are irrational (e.g., in FCC or HCP lattices). In these cases, you are expected to input coordinates with at least 3 digits of precision to ensure accurate evaluation of the unit cell.

#### Simulation Tips

Pay close attention to the atom placements and the relationships between them in the context of the unit cell’s geometry. Accurate placement is essential for building a correct unit cell.

#### Note

Some lattices are presented with an atom radius smaller than the mathematically calculated value to make the lattice points more visible and easier to work with during the experiment.