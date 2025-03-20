import { cap } from "../../../../utils/text_work/text_util";

export const fNavServProvPath = (featurePath: string, featureName: string) => `${featurePath}/presentation/providers/${featureName}_navigation_provider.dart`;



export const fNavServProv = (featureName: string) => {
  const capFeature = cap(featureName);

  return `
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/${featureName}_navigation_service.dart';

part '${featureName}_navigation_provider.g.dart';

@riverpod
${capFeature}NavigationService ${featureName}NavigationService(Ref ref) {
  return ${capFeature}NavigationService();
}

`;
};