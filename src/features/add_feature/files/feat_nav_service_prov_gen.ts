import { cap } from "../../../utils/text_work/text_util";




export const fNavServProvGenPth = (fPth: string, fName: string) => `${fPth}/presentation/providers/${fName}_navigation_provider.g.dart`;



export const fNavServProvGen = (fName: string) => {
  const capF = cap(fName);

  return `
// GENERATED CODE - DO NOT MODIFY BY HAND

part of '${fName}_navigation_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$${fName}NavigationServiceHash() =>
    r'f03c14873caf1ce8f4f324ef853a3117d17c2276';

/// See also [${fName}NavigationService].
@ProviderFor(${fName}NavigationService)
final ${fName}NavigationServiceProvider =
    AutoDisposeProvider<${capF}NavigationService>.internal(
      ${fName}NavigationService,
      name: r'${fName}NavigationServiceProvider',
      debugGetCreateSourceHash:
          const bool.fromEnvironment('dart.vm.product')
              ? null
              : _$${fName}NavigationServiceHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ${capF}NavigationServiceRef =
    AutoDisposeProviderRef<${capF}NavigationService>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package

`;
};