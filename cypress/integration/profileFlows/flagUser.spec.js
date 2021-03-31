describe('Flag user from profile page', () => {
  const flagConfirmText =
    'Are you sure you want to flag this person? This will make all of their posts less visible.';
  const unflagConfirmText =
    'Are you sure you want to unflag this person? This will make all of their posts visible again.';

  describe('Trusted user', () => {
    beforeEach(() => {
      cy.testSetup();
      cy.fixture('users/trustedUser.json').as('user');

      cy.get('@user').then((user) => {
        cy.loginUser(user).then(() => {
          cy.visit('/not_trusted_user');
        });
      });
    });

    it('should flag and unflag a user from the profile dropdown menu', () => {
      // Track expected flag status - needed for window:confirm callback
      let isFlagged = false;

      cy.on('window:confirm', (text) => {
        expect(text).to.equal(isFlagged ? unflagConfirmText : flagConfirmText);
        // Each time the confirm is accepted, the status should flip
        isFlagged = !isFlagged;
        // Press confirm on the modal
        return true;
      });

      //   Reload required for window:confirm to work
      cy.reload();
      cy.findByLabelText('Toggle dropdown menu').click();

      cy.findByRole('link', { name: 'Flag @not_trusted_user' }).should('exist');
      cy.findByText('Flag @not_trusted_user').click();

      cy.findByRole('link', { name: 'Unflag @not_trusted_user' }).should(
        'exist',
      );
      cy.findByRole('link', { name: 'Unflag @not_trusted_user' }).click();
      cy.findByRole('link', { name: 'Flag @not_trusted_user' }).should('exist');
    });

    it('should not flag a user if confirm dialog is cancelled', () => {
      cy.on('window:confirm', (text) => {
        expect(text).to.equal(flagConfirmText);
        // Press cancel on the modal
        return false;
      });

      //   Reload required for window:confirm to work
      cy.reload();

      cy.findByLabelText('Toggle dropdown menu').click();

      cy.findByRole('link', { name: 'Flag @not_trusted_user' }).should('exist');
      cy.findByText('Flag @not_trusted_user').click();

      cy.findByRole('link', { name: 'Unflag @not_trusted_user' }).should(
        'not.exist',
      );
      cy.findByRole('link', { name: 'Flag @not_trusted_user' }).should('exist');
    });

    it('should not unflag a user if confirm dialog is cancelled', () => {
      // Track expected flag status - needed for window:confirm callback
      let isFlagged = false;

      cy.on('window:confirm', (text) => {
        expect(text).to.equal(isFlagged ? unflagConfirmText : flagConfirmText);
        // Each time the confirm is accepted, the status should flip
        isFlagged = !isFlagged;
        // Press confirm on the modal if user is to be flagged, cancel if user is to be unflagged
        return isFlagged;
      });

      //   Reload required for window:confirm to work
      cy.reload();

      cy.findByLabelText('Toggle dropdown menu').click();
      cy.findByRole('link', { name: 'Flag @not_trusted_user' }).should('exist');
      cy.findByText('Flag @not_trusted_user').click();

      cy.findByRole('link', { name: 'Unflag @not_trusted_user' }).should(
        'exist',
      );
      cy.findByRole('link', { name: 'Unflag @not_trusted_user' }).click();
      cy.findByRole('link', { name: 'Flag @not_trusted_user' }).should(
        'not.exist',
      );
      cy.findByRole('link', { name: 'Unflag @not_trusted_user' }).should(
        'exist',
      );
    });

    it('should not show toggle menu on own profile', () => {
      cy.visit('/trusted_user');
      cy.findByLabelText('Toggle dropdown menu').should('not.be.visible');
      cy.findByRole('link', { name: 'Flag @trusted_user' }).should('not.exist');
    });
  });

  describe('Not trusted user', () => {
    beforeEach(() => {
      cy.testSetup();
      cy.fixture('users/notTrustedUser.json').as('user');

      cy.get('@user').then((user) => {
        cy.loginUser(user).then(() => {
          cy.visit('/trusted_user');
        });
      });
    });

    it('should not present flag user option in profile dropdown', () => {
      cy.findByLabelText('Toggle dropdown menu').click();
      cy.findByRole('link', { name: 'Flag @trusted_user' }).should('not.exist');
    });
  });
});
