"""""

@providers_bp.route("/sonarr/config/", methods=["PATCH"])
@login_required
@body(SonarrConfigSchema)
def test_sonarr_config(config):
    test = sonarr.check_status(config)
    if not test:
        raise BadRequest("Failed to connect to Sonarr.")

    version = int(test["version"][0])
    config.version = version
    root_folders = [
        folder["path"] for folder in get(sonarr.make_url(config, "/rootFolder")).json()
    ]
    if version == 3:
        quality_profiles = [
            {"id": profile["id"], "name": profile["name"]}
            for profile in get(sonarr.make_url(config, "/qualityprofile")).json()
        ]
        language_profiles = [
            {"id": profile["id"], "name": profile["name"]}
            for profile in get(sonarr.make_url(config, "/languageprofile")).json()
        ]
    else:
        quality_profiles = [
            {"id": profile["id"], "name": profile["name"]}
            for profile in get(sonarr.make_url(config, "/profile")).json()
        ]
        language_profiles = None
    return jsonify(
        {
            "version": version,
            "root_folders": root_folders,
            "quality_profiles": quality_profiles,
            "language_profiles": language_profiles,
        }
    )


@providers_bp.route("/sonarr/config/")
@login_required
@jsonify_with(SonarrConfigSchema)
def get_sonarr_config():
    sonarr_config = SonarrConfig.find(user=current_user)
    if not sonarr_config:
        return {}
    return sonarr_config


@providers_bp.route("/sonarr/config/", methods=["PUT"])
@login_required
@body(SonarrConfigSchema)
@jsonify_with(SonarrConfigSchema)
def update_sonarr_config(config):
    sonarr_config = SonarrConfig.find(user=current_user)
    if not sonarr_config:
        sonarr_config = SonarrConfig.create(
            api_key=config.api_key,
            host=config.host,
            root_folder=config.root_folder,
            quality_profile_id=config.quality_profile_id,
            version=config.version,
            user=current_user,
        )

    if not sonarr.check_status(config):
        raise BadRequest("Failed to connect to Sonarr.")

    sonarr_config.update(config)
    return sonarr_config
"""
