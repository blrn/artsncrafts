import os
import argparse
import pathlib
import jinja2


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out-dir', required=True, help='Name of the output directory, must not exist')
    parser.add_argument('--template-dir', default='templates', help='path to the templates directory')
    parser.add_argument('sketch_dir', help="sketch directory")

    args = parser.parse_args()

    out_dir_path = args.out_dir
    template_dir_path = args.template_dir
    sketch_dir_path = args.sketch_dir

    print(f"{out_dir_path=}")
    print(f"{template_dir_path=}")
    print(f"{sketch_dir_path=}")


    template_dir = pathlib.Path(template_dir_path)
    sketch_dir = pathlib.Path(sketch_dir_path)
    out_dir = pathlib.Path(out_dir_path)

    script_template_file = template_dir / "sketch.js.j2"
    html_template_file = template_dir / "sketch.html.j2"

    if out_dir.exists():
        print("error: out dir already exists")
        exit(1)

    out_dir.mkdir()


    with script_template_file.open('r') as f:
        script_template = f.read()
    with html_template_file.open('r') as f:
        html_template = f.read()
    
    out_sketch_dir_name = "sketches"

    for sk_file in sketch_dir.iterdir():
        file_name = sk_file.name
        base_name = file_name.split('.')[0]
        sketch_script_path = f"{out_sketch_dir_name}/{file_name}"
        template = jinja2.Template(html_template)

        html_out = template.render(sketch_path=sketch_script_path)

        print(html_out)

        out_file_path = out_dir / f"{base_name}.html"

        with out_file_path.open('w') as f:
            f.write(html_out)
    






    


    

if __name__ == '__main__':
    main()


