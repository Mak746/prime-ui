export class apiRoutes {
  private static Url = '';

  public static get baseUrl(): string {
    return this.Url;
  }

  /** Error Pages */
  public static get error404(): string {
    return this.baseUrl + '/errors/error404';
  }
  public static get error500(): string {
    return this.baseUrl + '/errors/error500';
  }
  /** Error Pages */

  /** Popular Professionals */
  public static get popularProfessionals(): string {
    return this.baseUrl + '/public/professionals/popular';
  }

  /** Professionals */
  public static get professionals(): string {
    return this.baseUrl + '/public/professionals/professional-users';
  }

  public static get professionalMemberships(): string {
    return this.baseUrl + '/users/professionals/professional-memberships';
  }

  public static get professionalExperiences(): string {
    return this.baseUrl + '/users/professionals/professional-experiences';
  }

  public static get professionalAchievements(): string {
    return this.baseUrl + '/users/professionals/professional-achievements';
  }

  public static get professionalServices(): string {
    return this.baseUrl + '/users/professionals/professional-services';
  }

  public static get professionalQualifications(): string {
    return this.baseUrl + '/users/professionals/professional-qualifications';
  }

  public static get professionalRegistrations(): string {
    return this.baseUrl + '/users/professionals/professional-registrations';
  }

  public static get professionalReviews(): string {
    return this.baseUrl + '/users/professionals/professional-reviews';
  }

  public static get professionalInfo(): string {
    return this.baseUrl + '/public/professionals/professional-info';
  }

  /** Appointment Booking */
  public static get bookingSlots(): string {
    return this.baseUrl + '/public/professionals/booking-slots';
  }

  /** Specialties */
  public static get specializations(): string {
    return this.baseUrl + '/public/specializations';
  }
  public static get subSpecializations(): string {
    return this.baseUrl + '/public/sub_specializations';
  }

  /** Cities */
  public static get cities(): string {
    return this.baseUrl + '/public/cities';
  }

  /** Blog Post Related  */
  public static get commentVotes(): string {
    return this.baseUrl + '';
  }
  public static get postCategories(): string {
    return this.baseUrl + '/public/engagements/post-categories';
  }
  public static get postCommentReply(): string {
    return this.baseUrl + '';
  }
  public static get postComments(): string {
    return this.baseUrl + '';
  }
  public static get postMeta(): string {
    return this.baseUrl + '';
  }
  public static get postVotes(): string {
    return this.baseUrl + '';
  }
  public static get posts(): string {
    return this.baseUrl + '/public/engagements/posts';
  }

  /** Patient Questions */
  public static get patientQuestions(): string {
    return this.baseUrl + '/public/engagements/patient-questions';
  }
  public static get patientAnswers(): string {
    return this.baseUrl + '/public/engagements/patient-answers';
  }
}
