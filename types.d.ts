import {Source} from 'tallbag';
import {Metadata} from 'shadow-callbag';

export default function flatten<T>(
  source: Source<Source<T, Metadata>, Metadata>,
): Source<T, Metadata>;
