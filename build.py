#!/usr/bin/env python

import re
from cgi import escape


def main(filename):
    """ Jenky example code builder """
    split_p = re.compile(r'<!--\[(/?(?:example|source))\]-->')
    result = []
    example = False
    source = False
    tag_p = '<!--[%s]-->'
    old_source = open(filename).read()
    for item in re.split(split_p, old_source):
        if item == 'example':
            example = True
            result.append(tag_p % item)
            continue
        if item == '/example':
            result.append(tag_p % item)
            example = re.sub(r'\s{%d}' % len(re.search(r'^\s+', example).group(0)), '\n', example)
            result += [tag_p % 'source',
                       '<div class="example-source"><pre class="sh_HTML">',
                       escape(example).lstrip('\n').replace('\n', '<br>'),
                       '</pre></div>',
                       tag_p % '/source']
            example = False
            continue
        if item == 'source':
            source = True
            continue
        if item == '/source':
            source = False
            continue
        if source:
            continue
        if example:
            example = item
            result.append(item)
            continue
        result.append(item)

    open('_' + filename, 'w').write(old_source)
    open(filename, 'w').write(''.join(result))


if __name__ == '__main__':
    main('index.html')
