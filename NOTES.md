# Bookworms — Notes & TODOs

A place to leave notes, ideas, and tasks for future sessions.

## TODO

- [x] Remove the "Summer Reading Challenge" line from above the h1 header.

- [x] Tighten up the data dashboard section: Remove the space between the pods. Make the text a little smaller. Remove the "Reading Progress" title from the timeline plot

### Railway volume setup (manual step required)
The Dockerfile now declares `VOLUME ["/data"]` and sets `DATA_DIR=/data` before the build.
To make data persist on Railway you must create a volume in the dashboard:
Railway dashboard → your service → **Volumes** tab → Add volume → mount path: `/data`
Without that volume mount, the `/data` directory is part of the container's ephemeral filesystem.


## Notes

- Style themes to consider including:
    - book worms
    - book shelves
    - classic Pizza Hut (building roof, red cups, etc)
    - "Book It" reading challenge 

