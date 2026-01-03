import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Transfer assessments-related data and media from an existing (old) DB configured under DATABASES["old"] into the default DB.'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Do not write to destination DB; only show counts and planned actions')

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        if 'old' not in settings.DATABASES:
            self.stderr.write(self.style.ERROR('No "old" database configured in settings.DATABASES. Add it before running this command.'))
            return

        # Ensure MEDIA roots are set
        old_media = getattr(settings, 'OLD_MEDIA_ROOT', None)
        new_media = getattr(settings, 'MEDIA_ROOT', None)
        if not old_media:
            self.stderr.write(self.style.ERROR('Please set OLD_MEDIA_ROOT in settings to the old project media directory path.'))
            return
        if not new_media:
            self.stderr.write(self.style.ERROR('MEDIA_ROOT is not set in settings.'))
            return

        # Import models lazily to avoid startup issues
        from assessments.models import Practice, Topic, Exam, Section, Question, Option, CorrectAnswer

        model_order = [Practice, Topic, Exam, Section, Question, Option, CorrectAnswer]

        for model in model_order:
            model_name = model.__name__
            qs_old = model.objects.using('old').all()
            count = qs_old.count()
            self.stdout.write(self.style.NOTICE(f'Found {count} {model_name} objects in old DB.'))
            if dry_run:
                continue

            for obj in qs_old:
                data = {}
                for field in model._meta.fields:
                    fname = field.name
                    # Skip AutoField primary key automatic handling, but we will supply pk to preserve identity
                    if field.primary_key:
                        continue

                    # FileFields: copy files and set the same relative path
                    if getattr(field, 'upload_to', None) is not None and hasattr(obj, fname):
                        filefield = getattr(obj, fname)
                        if filefield:
                            name = filefield.name
                            src = os.path.join(old_media, name)
                            dst = os.path.join(new_media, name)
                            dst_dir = os.path.dirname(dst)
                            try:
                                if not os.path.exists(dst_dir):
                                    os.makedirs(dst_dir, exist_ok=True)
                                if os.path.exists(src):
                                    shutil.copy2(src, dst)
                                    self.stdout.write(self.style.SUCCESS(f'Copied media file {name}'))
                                else:
                                    self.stdout.write(self.style.WARNING(f'Media file not found at {src}'))
                            except Exception as e:
                                self.stdout.write(self.style.ERROR(f'Failed copying media {src} -> {dst}: {e}'))
                            data[fname] = name
                        else:
                            data[fname] = None
                        continue

                    # ForeignKey fields: set to the same PK value (assumes referenced objects will also be copied)
                    if field.is_relation and field.many_to_one:
                        related_obj = getattr(obj, fname)
                        if related_obj is None:
                            data[fname + '_id' if not fname.endswith('_id') else fname] = None
                            data[fname] = None
                        else:
                            # Django stores FK column as <fieldname>_id
                            data[fname + '_id'] = getattr(obj, f'{fname}_id')
                        continue

                    # Regular fields
                    try:
                        data[fname] = getattr(obj, fname)
                    except Exception:
                        # if some field access fails, skip it
                        self.stdout.write(self.style.WARNING(f'Could not read field {fname} on {model_name} id={getattr(obj, obj._meta.pk.name)}'))

                # Build creation kwargs including pk to preserve identity
                pk_name = obj._meta.pk.name
                pk_value = getattr(obj, pk_name)
                try:
                    # Use update_or_create to avoid duplicates
                    defaults = data.copy()
                    # If FK fields ended up with both '<name>' and '<name>_id' keys, remove the direct one
                    for k in list(defaults.keys()):
                        if k.endswith('_id') and k[:-3] in defaults:
                            defaults.pop(k[:-3], None)

                    model.objects.using('default').update_or_create(**{pk_name: pk_value}, defaults=defaults)
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed to create/update {model_name} id={pk_value}: {e}'))

        self.stdout.write(self.style.SUCCESS('Transfer completed.'))
