export const feat_api_service_g = (servName: string, fileName: string) => {

    return `
    // dart format width=80
    // GENERATED CODE - DO NOT MODIFY BY HAND

    part of '${fileName}.dart';

    // **************************************************************************
    // ChopperGenerator
    // **************************************************************************

    // coverage:ignore-file
    // ignore_for_file: type=lint
    final class _$${servName} extends ${servName} {
    _$${servName}([ChopperClient? client]) {
        if (client == null) return;
        this.client = client;
    }

    @override
    final Type definitionType = ${servName};
    }

    
    `;};



