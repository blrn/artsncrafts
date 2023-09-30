import os
import argparse
import pathlib
import jinja2
from dataclasses import dataclass
import yaml
import shutil


@dataclass
class Sketch:
    name: str
    description: str
    href: str


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--out-dir", required=True, help="Name of the output directory, must not exist"
    )
    parser.add_argument(
        "--template-dir", default="templates", help="path to the templates directory"
    )
    parser.add_argument(
        "--clean", action="store_true", help="clean the output directory if it exists"
    )
    parser.add_argument("sketch_dir", help="sketch directory")

    args = parser.parse_args()

    out_dir_path = args.out_dir
    template_dir_path = args.template_dir
    sketch_dir_path = args.sketch_dir
    clean = args.clean

    print(f"{out_dir_path=}")
    print(f"{template_dir_path=}")
    print(f"{sketch_dir_path=}")

    template_dir = pathlib.Path(template_dir_path)
    sketch_dir = pathlib.Path(sketch_dir_path)
    out_dir = pathlib.Path(out_dir_path)

    index_template_file = template_dir / "index.html.j2"

    if out_dir.exists():
        if clean:
            print("warn: out dir exists, deleting")
            shutil.rmtree(out_dir)
        else:
            print("error: out dir already exists")
            exit(1)

    out_dir.mkdir()

    with index_template_file.open("r") as f:
        index_template_src = f.read()

    out_sketch_dir_name = "sketches"

    # go throug the sketch dir and build a list of sketch objects
    # then template the index.html file from the list of objects
    sketches = []
    for f in sketch_dir.iterdir():
        if not f.is_dir():
            continue
        sketch_href = f"{out_sketch_dir_name}/{f.name}/index.html"
        sketch_info_file = f / "sketch.yaml"
        sketch_name = None
        sketch_description = None
        if sketch_info_file.exists():
            with sketch_info_file.open("r") as f:
                sketch_info = yaml.safe_load(f)
                if temp_name := sketch_info.get("name"):
                    sketch_name = temp_name
                if temp_description := sketch_info.get("description"):
                    sketch_description = temp_description
        if not sketch_name:
            sketch_name = f.name
        if not sketch_description:
            sketch_description = ""
        sketch = Sketch(
            name=sketch_name, description=sketch_description, href=sketch_href
        )
        sketches.append(sketch)

    index_template = jinja2.Template(index_template_src)

    html_out = index_template.render(sketches=sketches)
    out_file_path = out_dir / "index.html"
    with out_file_path.open("w") as f:
        f.write(html_out)


if __name__ == "__main__":
    main()
