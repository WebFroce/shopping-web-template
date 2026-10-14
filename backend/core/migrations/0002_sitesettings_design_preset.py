from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="sitesettings",
            name="design_preset",
            field=models.CharField(
                choices=[
                    ("warm", "مدرن گرم"),
                    ("minimal", "مینیمال"),
                    ("luxury", "لوکس"),
                    ("studio", "استودیویی جسور"),
                ],
                default="warm",
                help_text=(
                    "چیدمان و ظاهر کلی هدر، صفحه اصلی، محصولات، فیلترها و فوتر را تعیین می‌کند."
                ),
                max_length=16,
                verbose_name="طرح ظاهری",
            ),
        ),
    ]
