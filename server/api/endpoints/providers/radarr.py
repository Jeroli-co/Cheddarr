"""

@providers_bp.route("/radarr/config/", methods=["PATCH"])
@login_required
@body(RadarrConfigSchema)
def test_radarr_config(config):
    test = radarr.check_status(config)
    if not test:
        raise BadRequest("Failed to connect to Radarr.")

    version = int(test["version"][0])
    config.version = version
    root_folders = [
        folder["path"] for folder in get(radarr.make_url(config, "/rootFolder")).json()
    ]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]}
        for profile in get(radarr.make_url(config, "/profile")).json()
    ]
    return jsonify(
        {
            "version": version,
            "root_folders": root_folders,
            "quality_profiles": quality_profiles,
        }
    )


@providers_bp.route("/radarr/config/")
@login_required
@jsonify_with(RadarrConfigSchema)
def get_radarr_config():
    radarr_config = RadarrConfig.find(user=current_user)
    if not radarr_config:
        return {}
    return radarr_config


@providers_bp.route("/radarr/config/", methods=["PUT"])
@login_required
@body(RadarrConfigSchema)
@jsonify_with(RadarrConfigSchema)
def update_radarr_config(config):
    radarr_config = RadarrConfig.find(user=current_user)
    if not radarr_config:
        radarr_config = RadarrConfig.create(
            get_api_key=config.api_key,
            host=config.host,
            root_folder=config.root_folder,
            quality_profile_id=config.quality_profile_id,
            user=current_user,
        )

    if not radarr.check_status(config):
        raise BadRequest("Failed to connect to Radarr.")

    radarr_config.update(config)
    return radarr_config
"""
