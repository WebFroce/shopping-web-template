from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_sitesettings_design_preset"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sitesettings",
            name="design_preset",
            field=models.CharField(
                choices=[
                    ("warm", "آتلیه ادیتوریال"),
                    ("minimal", "نوردیک روشن"),
                    ("luxury", "نوآر سینمایی"),
                    ("studio", "آرورا شیشه‌ای"),
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
