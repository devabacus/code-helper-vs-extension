import { capitalize } from "../../../../utils/text_work/text_util";

export const featureNavServiceProviderGen = (featureName: string) => {
  const capFeature = capitalize(featureName);

  return `
// GENERATED CODE - DO NOT MODIFY BY HAND

part of '${featureName}_navigation_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$${featureName}NavigationServiceHash() =>
    r'f03c14873caf1ce8f4f324ef853a3117d17c2276';

/// See also [${featureName}NavigationService].
@ProviderFor(${featureName}NavigationService)
final ${featureName}NavigationServiceProvider =
    AutoDisposeProvider<${capFeature}NavigationService>.internal(
      ${featureName}NavigationService,
      name: r'${featureName}NavigationServiceProvider',
      debugGetCreateSourceHash:
          const bool.fromEnvironment('dart.vm.product')
              ? null
              : _$${featureName}NavigationServiceHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ${capFeature}NavigationServiceRef =
    AutoDisposeProviderRef<${capFeature}NavigationService>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package

`;
};